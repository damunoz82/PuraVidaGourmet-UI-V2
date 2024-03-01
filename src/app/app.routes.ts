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

export const routes: Routes = [
    { path: '',
        title: 'Inicio',
        component: HomePageComponent
    },
    { path: 'login',
        title: 'Login',
        component: LoginComponent
    },
    { path: 'admin',
        title: 'Panel Administrativo',
        component: AdminMainPageComponent,
        children: [{
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
        }],
    },
    { path: '**', component: PageNotFoundComponent }
];
