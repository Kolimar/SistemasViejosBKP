import { NgModule, ModuleWithProviders }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule],      // module dependencies
    exports: [CommonModule, FormsModule],
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }

}
