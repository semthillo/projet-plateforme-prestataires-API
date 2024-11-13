import { createRouter, createWebHistory } from 'vue-router';
import Login from '@components/Login.vue';
import Dashboard from '@views/Dashboard.vue';
import User from '@/components/users/ListUser.vue';
import AddUser from '@/components/users/AddUser.vue';
import EditUser from '@/components/users/EditUser.vue';
import ViewUser from '@/components/users/ViewUser.vue';
import Expenses from '@/components/expenses/ListExpense.vue';
import AddExpense from '@/components/expenses/AddExpense.vue';
import EditExpense from '@/components/expenses/EditExpense.vue';
import ViewExpense from '@/components/expenses/ViewExpense.vue';
import Payments from '@/components/payments/ListPayment.vue';
import AddPayment from '@/components/payments/AddPayment.vue';
// import EditPayment from '@/components/payments/EditPayment.vue';
// import ViewPayment from '@/components/payments/ViewPayment.vue';
import Planning from '@/components/plannings/ListPlanning.vue';
import AddPlanning from '@/components/plannings/AddPlanning.vue';
import EditPlanning from '@/components/plannings/EditPlanning.vue';
import ViewPlanning from '@/components/plannings/ViewPlanning.vue';
import PaymentMethods from '@components/paymentMethods/ListPaymentMethod.vue';
import AddPaymentMethod from '@/components/paymentMethods/AddPaymentMethod.vue';
import EditPaymentMethod from '@/components/paymentMethods/EditPaymentMethod.vue';
import ViewPaymentMethod from '@/components/paymentMethods/ViewPaymentMethod.vue';
import ExpenseCategory from '@/components/expenseCategorys/ListExpenseCategory.vue';
import AddExpenseCategory from '@/components/expenseCategorys/AddExpenseCategory.vue';
import EditExpenseCategory from '@/components/expenseCategorys/EditExpenseCategory.vue';
import ViewExpenseCategory from '@/components/expenseCategorys/ViewExpenseCategory.vue';
import Home from '@/views/Home.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    children: [
      { path: 'user', name: 'user', component: User },
      { path: 'user/add', name: 'addUser', component: AddUser },
      { path: 'user/edit/:id', name: 'editUser', component: EditUser, props: true },
      { path: 'user/view/:id', name: 'viewUser', component: ViewUser, props: true },
      { path: 'expenses', name: 'expenses', component: Expenses },
      { path: 'expenses/add', name: 'addExpense', component: AddExpense },
      { path: 'expenses/edit/:id', name: 'editExpense', component: EditExpense, props: true },
      { path: 'expenses/view/:id', name: 'viewExpense', component: ViewExpense, props: true },
      { path: 'payments', name: 'payments', component: Payments },
      { path: 'payments/add', name: 'addPayment', component: AddPayment },
      // { path: 'payments/edit/:id', name: 'editPayment', component: EditPayment, props: true },
      // { path: 'payments/view/:id', name: 'viewPayment', component: ViewPayment, props: true },
      { path: 'planning', name: 'planning', component: Planning },
      { path: 'planning/add', name: 'addPlanning', component: AddPlanning },
      { path: 'planning/edit/:id', name: 'editPlanning', component: EditPlanning, props: true },
      { path: 'planning/view/:id', name: 'viewPlanning', component: ViewPlanning, props: true },
      { path: 'payment-methods', name: 'paymentMethods', component: PaymentMethods },
      { path: 'payment-methods/add', name: 'addPaymentMethod', component: AddPaymentMethod },
      { path: 'payment-methods/edit/:id', name: 'editPaymentMethod', component: EditPaymentMethod, props: true },
      { path: 'payment-methods/view/:id', name: 'viewPaymentMethod', component: ViewPaymentMethod, props: true },
      { path: 'expense-category', name: 'expenseCategory', component: ExpenseCategory },
      { path: 'expense-category/add', name: 'addExpenseCategory', component: AddExpenseCategory },
      { path: 'expense-category/edit/:id', name: 'editExpenseCategory', component: EditExpenseCategory, props: true },
      { path: 'expense-category/view/:id', name: 'viewExpenseCategory', component: ViewExpenseCategory, props: true },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;