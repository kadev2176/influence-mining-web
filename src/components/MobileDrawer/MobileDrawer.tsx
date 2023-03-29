import { Drawer } from 'antd';
import React from 'react';
import './MobileDrawer.scss';


export interface MobileDrawerProps {
    closable?: boolean,
    children: React.ReactNode
}

function MobileDrawer({ children, closable = true }: MobileDrawerProps) {
    return <>
        <Drawer
            className='mobile-drawer'
            title={null}
            placement={'bottom'}
            closable={closable}
            height={'fit-content'}
            open
        >
            {children}
        </Drawer>
    </>;
};

export default MobileDrawer;
