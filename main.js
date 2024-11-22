const URL = 'http://localhost:3000/api/v1/establishments';
const ESTABLISHMENT_CODE = 'NPDLFP';

const statusTranslate = {
  pending_kitchen: 'Aguardando confirmação da cozinha',
  preparing: 'Em Preparação',
  ready: 'Pronto',
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

const app = Vue.createApp({
  data() {
    return {
      orders: [], // Lista de pedidos
      selectedOrder: null, // Detalhes do pedido selecionado
      filterStatus: 'pending_kitchen', // Filtro de status
    };
  },
  methods: {
    // Buscar pedidos com base no status selecionado
    async getOrders() {
      try {
        let response = await fetch(
          `${URL}/${ESTABLISHMENT_CODE}/orders?status=${this.filterStatus}`
        );
        let data = await response.json();

        this.orders = data.map((order) => ({
          code: order.code,
          status: statusTranslate[order.status],
          customerName: order.costumer_name,
          createdAt: formatDate(order.created_at),
        }));
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    },
    // Buscar detalhes de um pedido
    async getOrderDetails(orderCode) {
      try {
        let response = await fetch(
          `${URL}/${ESTABLISHMENT_CODE}/orders/${orderCode}`
        );
        let data = await response.json();

        this.selectedOrder = {
          code: data.code,
          status: statusTranslate[data.status],
          customerName: data.costumer_name,
          customerEmail: data.costumer_email,
          createdAt: formatDate(data.created_at),
          items: data.items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
          })),
        };
      } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error);
      }
    },
    // Aceitar pedido
    async acceptOrder(orderCode) {
      try {
        let response = await fetch(
          `${URL}/${ESTABLISHMENT_CODE}/orders/${orderCode}/accept`,
          { method: 'PATCH' }
        );
        console.log(response)
        if (response.ok) {
          alert('Pedido aceito com sucesso!');
          this.getOrders(); // Atualiza a lista de pedidos
          this.closeOrderDetails(); // Fecha o modal
        } else {
          alert('Erro ao aceitar pedido. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao aceitar pedido:', error);
      }
    },
    // Aceitar pedido
    async readytOrder(orderCode) {
        try {
          let response = await fetch(
            `${URL}/${ESTABLISHMENT_CODE}/orders/${orderCode}/ready`,
            { method: 'PATCH' }
          );
          console.log(response)
          if (response.ok) {
            alert('Pedido concluído sucesso!');
            this.getOrders(); // Atualiza a lista de pedidos
            this.closeOrderDetails(); // Fecha o modal
          } else {
            alert('Erro ao concluír pedido. Tente novamente.');
          }
        } catch (error) {
          console.error('Erro ao concluír pedido.:', error);
        }
      },
    // Fechar o modal de detalhes
    closeOrderDetails() {
      this.selectedOrder = null;
    },
    // Atualizar filtro e buscar pedidos
    updateFilter(event) {
      this.filterStatus = event.target.value;
      this.getOrders();
    },
  },
  mounted() {
    this.getOrders();
  },
});

app.mount('#app');
