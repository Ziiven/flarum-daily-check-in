<?php

use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'checkin.allowCheckIn' => Group::MEMBER_ID
]);
