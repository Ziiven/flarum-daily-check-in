import { extend } from 'flarum/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import Button from 'flarum/components/Button';
import Alert from 'flarum/common/components/Alert';

app.initializers.add('ziven-checkin', () => {
  extend(IndexPage.prototype, 'sidebarItems', function(items) {
    if(app.session.user!==null){
      const totalContinuousCheckIn = app.session.user.attribute("totalContinuousCheckIn");
      const canCheckin = app.session.user.attribute("canCheckin");
      const canCheckinContinuous = app.session.user.attribute("canCheckinContinuous");
      const serverData = app.session.user.attribute("serverDate");
      let lastCheckinTime = app.session.user.attribute("lastCheckinTime");
      let checkinButton,checkinButtonText;

      if(canCheckin===true){
        checkinButtonText = app.translator.trans('ziven-checkin.forum.check-in');
        checkinButton = items.add('forum-checkin', Button.component({
          icon: 'fas fa-calendar',
          className: 'Button CheckInButton--yellow',
          itemClassName: 'App-primaryControl',
          onclick: () => {
            app.session.user.save({canCheckin:false,totalContinuousCheckIn:canCheckinContinuous===true?totalContinuousCheckIn+1:1});
            //const alertKey = app.alerts.show(Alert, { type: 'success' }, app.translator.trans('签到成功'));
          }
        }, checkinButtonText),50);
      }else{
        console.log(app.session.user.attribute("lastCheckinTime"));
        console.log(app.session.user.attribute("totalContinuousCheckIn"));
        checkinButtonText = totalContinuousCheckIn<=1?app.translator.trans('ziven-checkin.forum.checked-in-day', {count: totalContinuousCheckIn}):app.translator.trans('ziven-checkin.forum.checked-in-days', {count: totalContinuousCheckIn});
        checkinButton = items.add('forum-checkin', Button.component({
          icon: 'fas fa-calendar-check',
          className: 'Button CheckInButton--green',
          itemClassName: 'App-primaryControl',
          disabled: true
        }, checkinButtonText),50);
      }
    }
  });
});