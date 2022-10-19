<?php

use Flarum\Extend;
use Flarum\User\Event\Saving;
use Flarum\Api\Serializer\UserSerializer;
use Ziven\checkin\AddAttribute\AddUserCheckinAttributes;
use Ziven\checkin\Listeners\doCheckin;

return [
    (new Extend\Frontend('admin'))->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Frontend('forum'))->js(__DIR__ . '/js/dist/forum.js')->css(__DIR__.'/less/forum.less'),

    (new Extend\Locales(__DIR__ . '/locale')),

    (new Extend\Event())->listen(Saving::class, [doCheckin::class, 'checkinSaved']),
    (new Extend\ApiSerializer(UserSerializer::class))->attributes(AddUserCheckinAttributes::class),
    (new Extend\Settings())
        ->serializeToForum('forumCheckinRewarMoney', 'ziven-forum-checkin.checkinRewardMoney',function ($raw) {
            return (float)$raw;
        })
        ->serializeToForum('forumAutoCheckin', 'ziven-forum-checkin.autoCheckIn', 'intval', 0)
        ->serializeToForum('forumAutoCheckinDelay', 'ziven-forum-checkin.autoCheckInDelay', 'intval', 0)
        ->serializeToForum('forumCheckinTimeZone', 'ziven-forum-checkin.checkinTimeZone', 'intval', 0)
        ->serializeToForum('forumCheckinSuccessPromptType', 'ziven-forum-checkin.checkinSuccessPromptType', 'intval', 0)
        ->serializeToForum('forumCheckinSuccessPromptText', 'ziven-forum-checkin.checkinSuccessPromptText', 'strval')
        ->serializeToForum('forumCheckinSuccessPromptRewardText', 'ziven-forum-checkin.checkinSuccessPromptRewardText', 'strval')
];