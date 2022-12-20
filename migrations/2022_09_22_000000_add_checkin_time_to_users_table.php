<?php

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'last_checkin_time' => ['datetime', 'nullable' => true]
]);
