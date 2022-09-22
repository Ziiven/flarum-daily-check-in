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

        $timezone = $this->settings->get('ziven-forum-checkin.checkinTimeZone', 0);
        $time = time()+$timezone*60*60;

        $canCheckin = $last_checkin_time===null?true:(strtotime(date('Y-m-d', $time)." 23:59:59") - strtotime($last_checkin_time))/3600>=24;
        $attributes['canCheckin'] = $canCheckin;

        return $attributes;
    }
}
