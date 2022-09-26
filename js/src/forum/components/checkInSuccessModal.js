import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Stream from 'flarum/utils/Stream';

export default class checkInSuccessModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
  }

  className() {
    return 'checkInSuccessModal Modal--small';
  }

  title() {
    return (<div className="checkInSuccessModal successTitleText">{app.translator.trans('ziven-checkin.forum.check-in-success')}</div>);
  }

  content() {
    const totalContinuousCheckIn = app.session.user.attribute("totalContinuousCheckIn");
    const forumCheckinSuccessPromptText = app.forum.attribute("forumCheckinSuccessPromptText");
    const forumCheckinSuccessPromptRewardText = app.forum.attribute("forumCheckinSuccessPromptRewardText");
    const forumCheckinRewarMoney = app.forum.attribute("forumCheckinRewarMoney");
    const moneyExtensionExist = app.forum.attribute('antoinefr-money.moneyname')!==undefined;

    let moneyName = "";
    let rewardText = "";
    let successTextClassName = "checkInSuccessModal hideText";
    let rewardTextClassName = "checkInSuccessModal hideText";

    if(forumCheckinSuccessPromptText!==""){
      successTextClassName = "checkInSuccessModal successText";
    }

    if(moneyExtensionExist===true && forumCheckinSuccessPromptRewardText!==""){
      moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
      rewardText = moneyName.replace('[money]', forumCheckinRewarMoney);
      rewardTextClassName = "checkInSuccessModal rewardText";
    }

    return (
      <div className="Modal-body">
        <div className={successTextClassName}>{forumCheckinSuccessPromptText.replace('[days]', totalContinuousCheckIn)}</div>
        <div className={rewardTextClassName}>{forumCheckinSuccessPromptRewardText.replace('[reward]', rewardText)}</div>
      </div>
    );
  }
}
