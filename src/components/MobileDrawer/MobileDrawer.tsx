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
            height={'auto'}
            open
            onClose={() => { onClose && onClose() }}
        >
            {closable && <>
                <div className='close-header'>
                    <div className='close-icon' onClick={() => {
                        onClose && onClose()
                    }}>
                        <i className='fa-solid fa-xmark'></i>
                    </div>
                </div>
            </>}

            {children}
        </Drawer>
    </>;
};

export default MobileDrawer;
