<?php

namespace Ziven\checkin\Listeners;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\User\User;
use Flarum\User\Event\Saving;
use Ziven\checkin\Event\checkinUpdated;
use Illuminate\Support\Arr;

class doCheckin
{
    protected $settings;
    protected $events;

    public function __construct(SettingsRepositoryInterface $settings, Dispatcher $events)
    {
        $this->settings = $settings;
        $this->events = $events;
    }

    public function checkinSaved(Saving $event)
    {
        $attributes = Arr::get($event->data, 'attributes', []);

        if (array_key_exists('lastCheckinTime', $attributes)) {
            $timezone = $this->settings->get('ziven-forum-checkin.checkinTimeZone', 0);
            $time = time()+$timezone*60*60;
            $user = $event->user;
            $user->last_checkin_time = date('Y-m-d H:i:s', $time);

            if(isset($user->money)===true){
                $checkinRewardMoney = (float)$this->settings->get('ziven-forum-checkin.checkinRewardMoney', 0);
                $user->money+=$checkinRewardMoney;
            }

            $this->events->dispatch(new checkinUpdated($user));
        }
    }
}
