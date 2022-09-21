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
    (new Extend\Settings)->serializeToForum('forumCheckinRewarMoney', 'ziven-forum-checkin.checkinRewardMoney', null, 1),
    (new Extend\Settings)->serializeToForum('forumCheckinTimeZone', 'ziven-forum-checkin.checkinTimeZone', null, 0),

];