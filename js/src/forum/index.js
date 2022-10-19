import { extend } from 'flarum/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import Button from 'flarum/components/Button';
import Alert from 'flarum/common/components/Alert';
import checkInSuccessModal from './components/checkInSuccessModal';

app.initializers.add('ziven-checkin', () => {
  extend(IndexPage.prototype, 'sidebarItems', function(items) {
    if(app.session.user!==null){
      const routeName = app.current.get('routeName');

      const totalContinuousCheckIn = app.session.user.attribute("totalContinuousCheckIn");
      const canCheckin = app.session.user.attribute("canCheckin");
      const canCheckinContinuous = app.session.user.attribute("canCheckinContinuous");
      const serverData = app.session.user.attribute("serverDate");
      const forumCheckinSuccessPromptType = app.forum.attribute("forumCheckinSuccessPromptType");
      let checkInCompatibleExtensions = app.session.user.attribute("checkInCompatibleExtensions");
      let lastCheckinTime = app.session.user.attribute("lastCheckinTime");
      let checkinButtonText;
      let itemName = "forum-checkin";

      if(routeName==="tag"){
        if(checkInCompatibleExtensions.indexOf("fof-follow-tags")!==-1){
            itemName = "forum-checkin-1";
        }
      }

      if(canCheckin===true){
        checkinButtonText = app.translator.trans('ziven-checkin.forum.check-in');
        items.add(itemName, Button.component({
          icon: 'fas fa-calendar',
          className: 'Button CheckInButton--yellow',
          itemClassName: 'App-primaryControl',
          id:"checkInButton",
          onclick: () => {
            app.session.user.save({canCheckin:false,totalContinuousCheckIn:canCheckinContinuous===true?totalContinuousCheckIn+1:1});

            const forumCheckinSuccessPromptText = app.forum.attribute("forumCheckinSuccessPromptText");
            const forumCheckinSuccessPromptRewardText = app.forum.attribute("forumCheckinSuccessPromptRewardText");

            if(forumCheckinSuccessPromptText!=="" || forumCheckinSuccessPromptRewardText!==""){
              if(forumCheckinSuccessPromptType===1){
                const forumCheckinRewarMoney = app.forum.attribute("forumCheckinRewarMoney");
                const moneyExtensionExist = app.forum.attribute('antoinefr-money.moneyname')!==undefined;

                let moneyName = "";
                let rewardText = "";

                if(forumCheckinSuccessPromptText!==""){
                  const checkInSuccessText = forumCheckinSuccessPromptText.replace('[days]', totalContinuousCheckIn);
                  const successTextAlertKey = app.alerts.show(Alert, { type: 'success' }, checkInSuccessText);
                }

                if(moneyExtensionExist===true && forumCheckinSuccessPromptRewardText!==""){
                  moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
                  rewardText = moneyName.replace('[money]', forumCheckinRewarMoney);

                  const checkInSuccessRewardText = forumCheckinSuccessPromptRewardText.replace('[reward]', rewardText);
                  const successRewardTextAlertKey = app.alerts.show(Alert, { type: 'success' }, checkInSuccessRewardText);
                }

              }else if(forumCheckinSuccessPromptType===2){
                app.modal.show(checkInSuccessModal);
              }
            }
          }
        }, checkinButtonText),50);

        const forumAutoCheckIn = app.forum.attribute("forumAutoCheckin");
        const forumAutoCheckInDelay = app.forum.attribute("forumAutoCheckinDelay");

        if(forumAutoCheckIn===1){
          setTimeout(function(){
            $("#checkInButton").click();
          },forumAutoCheckInDelay);
        }
      }else{
        checkinButtonText = totalContinuousCheckIn<=1?app.translator.trans('ziven-checkin.forum.checked-in-day', {count: totalContinuousCheckIn}):app.translator.trans('ziven-checkin.forum.checked-in-days', {count: totalContinuousCheckIn});
        items.add(itemName, Button.component({
          icon: 'fas fa-calendar-check',
          className: 'Button CheckInButton--green',
          itemClassName: 'App-primaryControl',
          disabled: true
        }, checkinButtonText),50);
      }
    }
  });
});