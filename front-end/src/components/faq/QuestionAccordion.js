'use client'
import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';

export default function QuestionAccordion({faqData}) {

  const getItems = (panelStyle) => {
    return faqData.map((faq, index) => ({
      key: String(index + 1),
      label: `${index + 1}. ${faq.question}`,
      children: (
        <div dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
      ),
      style: panelStyle,
      showArrow: false,
    }));
  }

  const panelStyle = {
    marginBottom: 24,
    background: 'white',
    borderRadius: '15px',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    padding: '10px 5px',
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      className="[&_.ant-collapse-header-text]:font-bold [&_.ant-collapse-header-text]:uppercase md:!text-lg !bg-transparent"
      items={getItems(panelStyle)}
    />
  );
};