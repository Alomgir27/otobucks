import React from 'react';

import { Row, Col, Image } from 'antd';
import './styles.scss';

const StatCard = ({ icon, number, title }) => {
  return (
    <div id="statCard">
      <Row gutter={24}>
        <Col className="gutter-row">
          <img className="icon" width={40} src={icon} />
        </Col>
        <Col className="gutter-row" span={12}>
          <div className="data-card">
            <h4 style={{ fontSize: 15, marginTop: 10 }}>{title}</h4>
            <h3 style={{ fontSize: 20 }}>{number}</h3>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatCard;
