// components/cms/table/DateRangeModal.jsx
import { useState } from "react";
import { Modal, DatePicker, Button, Space, Alert, Select } from "antd";
import { CalendarOutlined, SortAscendingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br'; // Importa a localização do dayjs
import ptBR from 'antd/locale/pt_BR';
import { ConfigProvider } from "antd/lib";

// Configura o dayjs com a localização portuguesa
dayjs.locale('pt-br');

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function DateRangeModal({ visible, onCancel, onConfirm }) {
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("data_desc");

  const handleConfirm = async () => {
    if (!dateRange || dateRange.length !== 2) {
      return;
    }

    setLoading(true);
    try {
      // Garante que pegamos o primeiro dia do mês inicial e último dia do mês final
      const startDate = dateRange[0].startOf("month").format("YYYY-MM-DD");
      const endDate = dateRange[1].endOf("month").format("YYYY-MM-DD");

      await onConfirm(startDate, endDate, sortOption);
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current) => {
    // Não permite selecionar datas futuras
    return current && current > dayjs().endOf("day");
  };

  const sortOptions = [
    { value: "data_desc", label: "Data (mais recentes primeiro)" },
    { value: "data_asc", label: "Data (mais antigas primeiro)" },
    { value: "preco_desc", label: "Preço (maior para menor)" },
    { value: "preco_asc", label: "Preço (menor para maior)" },
    { value: "area_desc", label: "Área (maior para menor)" },
    { value: "area_asc", label: "Área (menor para maior)" },
    { value: "acessos_desc", label: "Mais acessados primeiro" },
    { value: "acessos_asc", label: "Menos acessados primeiro" },
  ];

  return (
    <ConfigProvider locale={ptBR}>
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            Configurar Relatório
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
        width={600}
      >
        <div style={{ padding: "20px 0" }}>
          <Alert
            message="Configure o período e ordenação do relatório"
            description="O relatório será gerado considerando o primeiro dia do mês inicial até o último dia do mês final, com a ordenação aplicada às tabelas."
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Período do Relatório:
            </label>
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
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              <SortAscendingOutlined style={{ marginRight: 8 }} />
              Ordenação das Tabelas:
            </label>
            <Select
              value={sortOption}
              onChange={setSortOption}
              style={{ width: "100%" }}
              size="large"
              placeholder="Selecione a ordenação"
            >
              {sortOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          {dateRange && dateRange.length === 2 && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "#f5f5f5",
                borderRadius: 6,
              }}
            >
              <strong>Configuração selecionada:</strong>
              <br />
              <strong>Período:</strong> {dateRange[0].startOf("month").format("DD/MM/YYYY")} até {dateRange[1].endOf("month").format("DD/MM/YYYY")}
              <br />
              <strong>Ordenação:</strong> {sortOptions.find(opt => opt.value === sortOption)?.label}
            </div>
          )}
        </div>
      </Modal>
    </ConfigProvider>
  );
}