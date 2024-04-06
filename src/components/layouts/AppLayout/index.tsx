import { Outlet } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import useInit from '@/hooks/init'; // 后期用于初始化数据

import styles from './index.module.scss';

const AppLayout = () => {
    useInit();
    return (
        <div className={styles.layout}>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default AppLayout;
