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
});
