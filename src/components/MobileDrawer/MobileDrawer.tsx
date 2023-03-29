import { Drawer } from 'antd';
import React from 'react';
import './MobileDrawer.scss';


export interface MobileDrawerProps {
    closable?: boolean,
    children: React.ReactNode,
    onClose?: () => void
}

function MobileDrawer({ children, closable = true, onClose }: MobileDrawerProps) {
    return <>
        <Drawer
            className='mobile-drawer'
            title={null}
            placement={'bottom'}
            closable={false}
            maskClosable={closable}
            height={'fit-content'}
            open
            onClose={() => { onClose && onClose() }}
        >
            {children}
        </Drawer>
    </>;
};

export default MobileDrawer;
