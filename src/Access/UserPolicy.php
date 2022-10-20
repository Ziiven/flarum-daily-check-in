<?php

namespace Ziven\checkin\Access;

use Carbon\Carbon;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class UserPolicy extends AbstractPolicy{
    public function allowCheckIn(User $actor, User $user){
        if (($actor->id === $user->id && $actor->hasPermission('checkin.allowCheckIn') && !$this->isSuspended($user)))) {
            return $this->allow();
        }

        return $this->deny();
    }

    protected function isSuspended(User $user): bool{
        return $user->suspended_until !== null
            && $user->suspended_until instanceof Carbon
            && $user->suspended_until->isFuture();
    }
}
