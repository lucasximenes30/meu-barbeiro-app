import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Formatter helper inside the PDF environment
const formatCurrencyPDF = (value: number) => {
  return `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

const formatNumberPDF = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #18181b',
    paddingBottom: 15,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 5,
  },
  reportTitle: {
    fontSize: 16,
    color: '#52525b',
    marginBottom: 5,
  },
  reportDate: {
    fontSize: 10,
    color: '#71717a',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#18181b',
    borderBottom: '1 solid #e4e4e7',
    paddingBottom: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  card: {
    width: '30%',
    padding: 10,
    backgroundColor: '#f4f4f5',
    borderRadius: 4,
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 10,
    color: '#52525b',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18181b',
  },
  cardValueGreen: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  cardValueRed: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  variationPos: {
    fontSize: 10,
    color: '#10b981',
    marginTop: 4,
  },
  variationNeg: {
    fontSize: 10,
    color: '#ef4444',
    marginTop: 4,
  },
  variationNeu: {
    fontSize: 10,
    color: '#71717a',
    marginTop: 4,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f4f4f5',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#18181b',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    color: '#3f3f46',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#a1a1aa',
    fontSize: 8,
    borderTop: '1 solid #e4e4e7',
    paddingTop: 10,
  },
  insightItem: {
    fontSize: 11,
    color: '#3f3f46',
    marginBottom: 5,
    lineHeight: 1.5,
  }
});

interface ReportPDFProps {
  data: any;
  periodType: 'monthly' | 'yearly';
  dateLabel: string;
  barbershopName: string;
}

export const ReportPDF = ({ data, periodType, dateLabel, barbershopName }: ReportPDFProps) => {
  const generatedAt = new Date().toLocaleString('pt-BR');

  const renderVariation = (val: number | undefined) => {
    if (val === undefined || val === 0) return <Text style={styles.variationNeu}>- 0%</Text>;
    if (val > 0) return <Text style={styles.variationPos}>+{val.toFixed(1)}%</Text>;
    return <Text style={styles.variationNeg}>{val.toFixed(1)}%</Text>;
  };

  const getInsights = () => {
    const insights = [];
    if (data.variations.revenue > 0) {
      insights.push(`O faturamento aumentou ${data.variations.revenue.toFixed(1)}% em relação ao período anterior.`);
    } else if (data.variations.revenue < 0) {
      insights.push(`O faturamento diminuiu ${Math.abs(data.variations.revenue).toFixed(1)}% em relação ao período anterior.`);
    }

    if (data.charts.topServices && data.charts.topServices.length > 0) {
      insights.push(`"${data.charts.topServices[0].name}" foi o serviço que mais gerou receita.`);
    }

    if (data.charts.topBarbers && data.charts.topBarbers.length > 0) {
      insights.push(`${data.charts.topBarbers[0].name} liderou o faturamento da equipe com ${formatCurrencyPDF(data.charts.topBarbers[0].revenue)}.`);
    }

    if (data.charts.paymentMethods && data.charts.paymentMethods.length > 0) {
      insights.push(`A forma de pagamento mais utilizada foi ${data.charts.paymentMethods[0].method.toUpperCase()}.`);
    }

    return insights;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{barbershopName}</Text>
          <Text style={styles.reportTitle}>RELATÓRIO FINANCEIRO E OPERACIONAL</Text>
          <Text style={styles.reportTitle}>{periodType === 'monthly' ? 'Resumo Mensal' : 'Resumo Anual'} - {dateLabel}</Text>
          <Text style={styles.reportDate}>Gerado em {generatedAt}</Text>
        </View>

        {/* RESUMO EXECUTIVO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Período</Text>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Faturamento</Text>
              <Text style={styles.cardValue}>{formatCurrencyPDF(data.metrics.revenue)}</Text>
              {renderVariation(data.variations.revenue)}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Despesas</Text>
              <Text style={styles.cardValueRed}>{formatCurrencyPDF(data.metrics.expenses)}</Text>
              {renderVariation(data.variations.expenses)}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Lucro</Text>
              <Text style={styles.cardValueGreen}>{formatCurrencyPDF(data.metrics.profit)}</Text>
              {renderVariation(data.variations.profit)}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Atendimentos</Text>
              <Text style={styles.cardValue}>{formatNumberPDF(data.metrics.appointments)}</Text>
              {renderVariation(data.variations.appointments)}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Novos Clientes</Text>
              <Text style={styles.cardValue}>{formatNumberPDF(data.metrics.newClients)}</Text>
              {renderVariation(data.variations.newClients)}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Ticket Médio</Text>
              <Text style={styles.cardValue}>{formatCurrencyPDF(data.metrics.averageTicket || (data.metrics.appointments ? data.metrics.revenue / data.metrics.appointments : 0))}</Text>
            </View>
          </View>
        </View>

        {/* FORMAS DE PAGAMENTO */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Formas de Pagamento</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: '50%' }]}><Text style={styles.tableCellHeader}>Método</Text></View>
              <View style={[styles.tableColHeader, { width: '50%' }]}><Text style={styles.tableCellHeader}>Valor Recebido</Text></View>
            </View>
            {(() => {
              const totalPayments = data.charts.paymentMethods.reduce((acc: number, pm: any) => acc + pm.amount, 0);
              return data.charts.paymentMethods.map((pm: any, i: number) => {
                const percent = totalPayments > 0 ? (pm.amount / totalPayments) * 100 : 0;
                return (
                  <View style={styles.tableRow} key={i}>
                    <View style={[styles.tableCol, { width: '50%' }]}><Text style={styles.tableCell}>{pm.method.toUpperCase()}</Text></View>
                    <View style={[styles.tableCol, { width: '50%' }]}><Text style={styles.tableCell}>{formatCurrencyPDF(pm.amount)} ({percent.toFixed(1)}%)</Text></View>
                  </View>
                );
              });
            })()}
            {data.charts.paymentMethods.length === 0 && (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '100%' }]}><Text style={styles.tableCell}>Sem dados de pagamento no período.</Text></View>
              </View>
            )}
          </View>
        </View>

        {/* SERVIÇOS MAIS VENDIDOS */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Desempenho de Serviços</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: '50%' }]}><Text style={styles.tableCellHeader}>Serviço</Text></View>
              <View style={[styles.tableColHeader, { width: '25%' }]}><Text style={styles.tableCellHeader}>Quantidade</Text></View>
              <View style={[styles.tableColHeader, { width: '25%' }]}><Text style={styles.tableCellHeader}>Receita</Text></View>
            </View>
            {data.charts.topServices.map((s: any, i: number) => (
              <View style={styles.tableRow} key={i}>
                <View style={[styles.tableCol, { width: '50%' }]}><Text style={styles.tableCell}>{s.name}</Text></View>
                <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>{s.count}</Text></View>
                <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>{formatCurrencyPDF(s.revenue)}</Text></View>
              </View>
            ))}
            {data.charts.topServices.length === 0 && (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '100%' }]}><Text style={styles.tableCell}>Nenhum serviço registrado.</Text></View>
              </View>
            )}
          </View>
        </View>

        {/* RANKING BARBEIROS */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Desempenho da Equipe</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: '40%' }]}><Text style={styles.tableCellHeader}>Barbeiro</Text></View>
              <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Atend.</Text></View>
              <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Receita</Text></View>
              <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Ticket Médio</Text></View>
            </View>
            {data.charts.topBarbers.map((b: any, i: number) => (
              <View style={styles.tableRow} key={i}>
                <View style={[styles.tableCol, { width: '40%' }]}><Text style={styles.tableCell}>{b.name}</Text></View>
                <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{b.count}</Text></View>
                <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatCurrencyPDF(b.revenue)}</Text></View>
                <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatCurrencyPDF(b.count > 0 ? b.revenue / b.count : 0)}</Text></View>
              </View>
            ))}
            {data.charts.topBarbers.length === 0 && (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '100%' }]}><Text style={styles.tableCell}>Nenhum barbeiro pontuou no período.</Text></View>
              </View>
            )}
          </View>
        </View>

        {/* INSIGHTS */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Insights do Período</Text>
          {getInsights().map((insight, idx) => (
            <Text key={idx} style={styles.insightItem}>• {insight}</Text>
          ))}
          {getInsights().length === 0 && (
            <Text style={styles.insightItem}>Nenhum insight disponível para o volume atual de dados.</Text>
          )}
        </View>

        {/* FOOTER */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Meu Barbeiro • Gerado em ${generatedAt} • Página ${pageNumber} de ${totalPages}`
        )} fixed />

      </Page>
    </Document>
  );
};
