import { Outlet } from 'react-router-dom';
import Header from '@/components/layouts/Header';
// import useInit from '@/hooks/init'; // 后期用于初始化数据

const AppLayout = () => {
    //   useInit();
    return (
        <div
        >
            <Header />
            <Outlet />
        </div>
    );
};

export default AppLayout;
