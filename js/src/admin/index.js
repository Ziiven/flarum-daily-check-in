import {extend, override} from 'flarum/extend';

app.initializers.add('ziven-checkin', () => {
  app.extensionData
    .for('ziiven-daily-check-in')
    .registerSetting(function () {
      return (
        <div className="Form-group">
          <label>{app.translator.trans('ziven-checkin.admin.settings.reward-money')}</label>
          <div class="helpText">{app.translator.trans('ziven-checkin.admin.settings.reward-money-requirement')}</div>
          <input type="number" className="FormControl" step="any" bidi={this.setting('ziven-forum-checkin.checkinRewardMoney')} />
        </div>
      );
    })
    .registerSetting({
      setting: 'ziven-forum-checkin.checkinTimeZone',
      label: app.translator.trans('ziven-checkin.admin.settings.timezone'),
      type: 'number',
    })
    .registerSetting({
      setting: 'ziven-forum-checkin.autoCheckIn',
      label: app.translator.trans('ziven-checkin.admin.settings.auto-check-in'),
      type: 'switch',
    })
    .registerSetting({
      setting: 'ziven-forum-checkin.autoCheckInDelay',
      label: app.translator.trans('ziven-checkin.admin.settings.auto-check-in-delay'),
      type: 'number',
    })
    .registerSetting({
      setting: 'ziven-forum-checkin.checkinSuccessPromptType',
      label: app.translator.trans('ziven-checkin.admin.settings.check-in-success-prompt-type'),
      type: 'select',
      options: {
        0: app.translator.trans('ziven-checkin.admin.settings.None'),
        1: app.translator.trans('ziven-checkin.admin.settings.Alert'),
        2: app.translator.trans('ziven-checkin.admin.settings.Modal')
      },
    })
    .registerSetting(function () {
      return (
        <div className="Form-group">
          <label>{app.translator.trans('ziven-checkin.admin.settings.check-in-success-prompt-text')}</label>
          <div class="helpText">{app.translator.trans('ziven-checkin.admin.settings.check-in-success-prompt-example-text')}</div>
          <input type="string" className="FormControl" step="any" bidi={this.setting('ziven-forum-checkin.checkinSuccessPromptText')} />
        </div>
      );
    })
    .registerSetting(function () {
      return (
        <div className="Form-group">
          <label>{app.translator.trans('ziven-checkin.admin.settings.check-in-success-prompt-reward-text')}</label>
          <div class="helpText">{app.translator.trans('ziven-checkin.admin.settings.reward-money-requirement')}</div>
          <div class="helpText">{app.translator.trans('ziven-checkin.admin.settings.check-in-success-prompt-example-reward-text')}</div>
          <input type="string" className="FormControl" step="any" bidi={this.setting('ziven-forum-checkin.checkinSuccessPromptRewardText')} />
        </div>
      );
    })
    .registerPermission(
      {
        icon: 'fas fa-id-card',
        label: app.translator.trans('ziven-checkin.admin.settings.allow-check-in'),
        permission: 'checkin.allowCheckIn',
      },
      'moderate',
      90
    )
});
