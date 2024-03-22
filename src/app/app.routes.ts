import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AdminMainPageComponent } from './admin/admin-main-page/admin-main-page.component';
import { DepartamentoComponent } from './admin/departamento/departamento.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TipoRecetaComponent } from './admin/tipo-receta/tipo-receta.component';
import { TipoProductoComponent } from './admin/tipo-producto/tipo-producto.component';
import { ProductoComponent } from './admin/producto/producto.component';
import { RecetaComponent } from './admin/receta/receta.component';
import { InventarioComponent } from './admin/inventario/inventario.component';
import { InventarioNewComponent } from './admin/inventario-new/inventario-new.component';
import { ContentComponent } from './admin/content/content.component';
import { MenuComponent } from './admin/menu/menu.component';
import { MenuEditComponent } from './admin/menu-edit/menu-edit.component';
import { ItemMenuComponent } from './admin/item-menu/item-menu.component';
import { MesaComponent } from './admin/mesa/mesa.component';
import { HomeComponent } from './home/home.component';
import { CocinaComponent } from './restaurante/cocina/cocina.component';
import { RestMainPageComponent } from './restaurante/rest-main-page/rest-main-page.component';
import { OrdenesComponent } from './admin/ordenes/ordenes.component';
import { DashboardComponent } from './restaurante/dashboard/dashboard.component';
import { CajaComponent } from './restaurante/caja/caja.component';
import { ServicioComponent } from './restaurante/servicio/servicio.component';
import { BarComponent } from './restaurante/bar/bar.component';

export const routes: Routes = [
    { path: '',
        title: 'Inicio',
        component: HomePageComponent
    },
    { path: 'login',
        title: 'Login',
        component: LoginComponent
    },
    { path: 'home',
        title: 'Home',
        component: HomeComponent
    },
    { path: 'restaurante',
        title: 'Panel Restaurante',
        component: RestMainPageComponent,
        children: [{
            path: '', 
            redirectTo: 'dashboard',
            pathMatch: 'full'
        }, {
            path: 'dashboard',
            component: DashboardComponent
        }, {
            path: 'cocina',
            component: CocinaComponent
        }, {
            path: 'caja',
            component: CajaComponent
        }, {
            path: 'servicio',
            component: ServicioComponent
        }, {
            path: 'bar',
            component: BarComponent
        }]
    },
    { path: 'admin',
        title: 'Panel Administrativo',
        component: AdminMainPageComponent,
        children: [{
            path: '', 
            redirectTo: 'dashboard',
            pathMatch: 'full'
        }, {
            path: 'dashboard',
            component: ContentComponent
        },
        {
            path: 'departamento',
            component: DepartamentoComponent
        }, {
            path: 'tipoReceta',
            component: TipoRecetaComponent
        }, {
            path: 'tipoProducto',
            component: TipoProductoComponent
        }, {
            path: 'producto',
            component: ProductoComponent
        }, {
            path: 'receta',
            component: RecetaComponent
        }, {
            path: 'ordenes',
            component: OrdenesComponent
        }, {
            path: 'inventario',
            component: InventarioComponent
        }, {
            path: 'inventario-details',
            children: [{
                path: '',
                component: InventarioNewComponent
            },
            {
                path: ':id',
                component: InventarioNewComponent
            }]
        }, {
            path: 'restaurante-mesa',
            component: MesaComponent
        }, {
            path: 'menu',
            component: MenuComponent
        }, {
            path: 'menu-details',
            children: [{
                path: '',
                component: MenuEditComponent
            },
            {
                path: ':id',
                component: MenuEditComponent
            }]
        }, {
            path: 'menu-item',
            component: ItemMenuComponent
        }],
    },
    { path: '**', component: PageNotFoundComponent }
];
