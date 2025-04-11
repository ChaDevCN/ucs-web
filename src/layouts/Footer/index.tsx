import React from 'react';

import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;
const Footer = () => {
	return <AntFooter className="text-center !py-4">aixdb ©2025</AntFooter>;
};
export default React.memo(Footer);
