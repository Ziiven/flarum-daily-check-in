<?php

namespace Ziven\checkin\AddAttribute;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;

class AddUserCheckinAttributes
{
    protected $settings;
    protected $events;

    public function __construct(SettingsRepositoryInterface $settings, Dispatcher $events)
    {
        $this->settings = $settings;
        $this->events = $events;
    }
    
    public function __invoke(UserSerializer $serializer, User $user)
    {
        $last_checkin_time = $user->last_checkin_time;
        $attributes = [];
        $attributes['lastCheckinTime'] = $user->last_checkin_time;
        $attributes['totalContinuousCheckIn'] = $user->total_continuous_checkin_count;
        $attributes['checkInCompatibleExtensions'] = [];

        $extensions_enabled = json_decode($this->settings->get('extensions_enabled'));
        $compatibleCheckList = array("fof-follow-tags");

        foreach ($compatibleCheckList as $key => $value) {
            $fof_follow_tags = array_search($value, $extensions_enabled);

            if($fof_follow_tags!==false){
                array_push($attributes['checkInCompatibleExtensions'],$value);
            }
        }

        $timezone = intval($this->settings->get('ziven-forum-checkin.checkinTimeZone', 0));
        $time = time()+$timezone*60*60;

        $lastCheckinTimeTimestamp = $last_checkin_time===null?0:strtotime($last_checkin_time);
        $timedifference = (strtotime(date('Y-m-d', $time)." 23:59:59") - $lastCheckinTimeTimestamp)/3600;
        $attributes['canCheckin'] = $last_checkin_time===null?true:$timedifference>=24;
        $attributes['canCheckinContinuous'] = $timedifference<48;

        return $attributes;
    }
}
