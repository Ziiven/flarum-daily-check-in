<?php

namespace Ziven\checkin\Listeners;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\User\User;
use Flarum\User\Event\Saving;
use Ziven\checkin\Event\checkinUpdated;
use Illuminate\Support\Arr;

class doCheckin{
    protected $settings;
    protected $events;

    public function __construct(SettingsRepositoryInterface $settings, Dispatcher $events){
        $this->settings = $settings;
        $this->events = $events;
    }

    public function checkinSaved(Saving $event){
        $actor = $event->actor;
        $user = $event->user;
        $allowCheckIn = $actor->can('checkin.allowCheckIn', $user);

        if($allowCheckIn){
            $attributes = Arr::get($event->data, 'attributes', []);

            if (array_key_exists('canCheckin', $attributes)) {
                $canCheckin = true;
                $timezone = intval($this->settings->get('ziven-forum-checkin.checkinTimeZone', 0));
                $current_timestamp = time()+$timezone*60*60;
                $current_data_at_midnight = strtotime(date('Y-m-d', $current_timestamp)." 00:00:00");
                
                $last_checkin_time = $user->last_checkin_time;
                $explode_checkin_data = explode(' ', $last_checkin_time);
                $checkin_date_at_midnight = strtotime($explode_checkin_data[0]." 00:00:00");

                if($last_checkin_time!==null){
                    $canCheckin = $current_data_at_midnight>$checkin_date_at_midnight;
                }
                
                if($canCheckin){
                    if(($current_timestamp-$checkin_date_at_midnight)/3600<48){
                        $user->total_continuous_checkin_count+=1;
                    }else{
                        $user->total_continuous_checkin_count=1;
                    }

                    $user->last_checkin_time = date('Y-m-d H:i:s', $current_timestamp);
                    $user->total_checkin_count+=1;

                    // app("log")->error($canCheckin);
                    // app("log")->error($user->total_continuous_checkin_count);

                    if(isset($user->money)===true){
                        $checkinRewardMoney = (float)$this->settings->get('ziven-forum-checkin.checkinRewardMoney', 0);
                        $user->money+=$checkinRewardMoney;
                    }

                    $this->events->dispatch(new checkinUpdated($user));
                }
            }
        }
    }
}
