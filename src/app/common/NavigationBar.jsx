import styles from './navigation-bar.module.css';
import logoImg from '../../@assets/HAEAHN_LOGO.png';

function NavigationBar(){
    //var profileImg = "https://hub.haeahn.com/Storage/GW/ImageStorage/Employee/" + this.state.userId + ".jpg";
    //var profileImg = "https://hub.haeahn.com/Storage/GW/ImageStorage/Employee/sj.min.jpg";
    
    return (
        <div className={styles.wrapper}>
            <img src={logoImg} alt="logo"/>
        </div>
    );
}

export default NavigationBar;