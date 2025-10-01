import React, { useState } from 'react';

const AccordionItem = ({ title, content }: { title: string, content: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid #444' }}>
      <button
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          color: 'white'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && <div style={{ padding: '16px', color: '#ccc' }}>{content}</div>}
    </div>
  );
};

const TutorialGuide = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100%',
      background: '#2d2d2d',
      transition: 'width 0.3s',
      width: isCollapsed ? '50px' : '300px',
      overflow: 'hidden',
      boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
      color: 'white'
    }}>
      <button onClick={() => setIsCollapsed(!isCollapsed)} style={{
        padding: '16px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'center',
        fontSize: '24px',
        color: 'white'
      }}>
        {isCollapsed ? '?' : '<<'}
      </button>
      <div style={{ display: isCollapsed ? 'none' : 'block' }}>
        <h1 style={{ padding: '16px', margin: 0 }}>Tutorial Guide</h1>
        <AccordionItem
          title="RPN System"
          content={<p>Reverse Polish Notation (RPN) is a mathematical notation in which every operator follows all of its operands. For example, to add 3 and 4, you would type `3`, `ENTER`, `4`, `+`.</p>}
        />
        <AccordionItem
          title="TVM Keys"
          content={<p>The Time Value of Money (TVM) keys are used for financial calculations. For example, to calculate the future value of an investment, you would input the number of periods (N), interest rate (i), present value (PV), and payment (PMT), then press FV.</p>}
        />
        <AccordionItem
          title="Date Functions"
          content={<p>The date function (ΔMTS) allows you to calculate the number of months between two dates. Enter the first date, press `ENTER`, enter the second date, and the calculator will display the number of months between them.</p>}
        />
        <AccordionItem
          title="Misc Functions"
          content={<p>The miscellaneous functions include converting interest rates. `→i%mo` converts a yearly rate to a monthly rate, and `→i%yr` converts a monthly rate to a yearly rate. `→15%IR` and `→22.5%IR` convert tax-free investment to investment with 15% or 22.5% IR respectively.</p>}
        />
      </div>
    </div>
  );
};

export default TutorialGuide;
