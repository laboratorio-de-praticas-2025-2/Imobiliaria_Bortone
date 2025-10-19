// components/cms/table/DateRangeModal.jsx
import { useState } from "react";
import { Modal, DatePicker, Button, Space, Alert } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br'; // Importa a localização do dayjs
import ptBR from 'antd/locale/pt_BR';
import { ConfigProvider } from "antd/lib";

// Configura o dayjs com a localização portuguesa
dayjs.locale('pt-br');

const { RangePicker } = DatePicker;

export default function DateRangeModal({ visible, onCancel, onConfirm }) {
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!dateRange || dateRange.length !== 2) {
      return;
    }

    setLoading(true);
    try {
      // Garante que pegamos o primeiro dia do mês inicial e último dia do mês final
      const startDate = dateRange[0].startOf("month").format("YYYY-MM-DD");
      const endDate = dateRange[1].endOf("month").format("YYYY-MM-DD");

      await onConfirm(startDate, endDate);
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current) => {
    // Não permite selecionar datas futuras
    return current && current > dayjs().endOf("day");
  };

  return (
    <ConfigProvider locale={ptBR}>
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            Selecione o Período do Relatório
          </Space>
        }
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancelar
          </Button>,
          <Button
            key="confirm"
            type="primary"
            loading={loading}
            onClick={handleConfirm}
            disabled={!dateRange || dateRange.length !== 2}
          >
            Gerar Relatório
          </Button>,
        ]}
        width={500}
      >
        <div style={{ padding: "20px 0" }}>
          <Alert
            message="Selecione o intervalo de meses"
            description="O relatório será gerado considerando o primeiro dia do mês inicial até o último dia do mês final."
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />

          <RangePicker
            picker="month"
            format="MMM/YYYY"
            value={dateRange}
            onChange={setDateRange}
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            size="large"
            placeholder={["Mês inicial", "Mês final"]}
          />

          {dateRange && dateRange.length === 2 && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "#f5f5f5",
                borderRadius: 6,
              }}
            >
              <strong>Período selecionado:</strong>
              <br />
              De: {dateRange[0].startOf("month").format("DD/MM/YYYY")}
              <br />
              Até: {dateRange[1].endOf("month").format("DD/MM/YYYY")}
            </div>
          )}
        </div>
      </Modal>
    </ConfigProvider>
  );
}