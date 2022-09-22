<?php

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'total_checkin_count' => ['integer','default' => 0],
    'total_continuous_checkin_count' => ['integer','default' => 0]
]);
