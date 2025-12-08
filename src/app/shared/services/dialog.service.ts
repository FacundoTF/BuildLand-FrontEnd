import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dialog, DialogData } from '../components/dialog/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(MatDialog);

  showMessage(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(Dialog, {
      data: {
        title,
        message,
        confirmText: 'Aceptar',
        showCancel: false,
      } as DialogData,
      disableClose: false,
      width: '400px',
    });

    const dialogComponent = dialogRef.componentInstance;
    dialogComponent.title.set(title);
    dialogComponent.message.set(message);
    dialogComponent.confirmText.set('Aceptar');
    dialogComponent.showCancel.set(false);

    return dialogRef.afterClosed();
  }

  showConfirm(
    title: string,
    message: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar',
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(Dialog, {
      data: {
        title,
        message,
        confirmText,
        cancelText,
        showCancel: true,
      } as DialogData,
      disableClose: false,
      width: '400px',
    });

    const dialogComponent = dialogRef.componentInstance;
    dialogComponent.title.set(title);
    dialogComponent.message.set(message);
    dialogComponent.confirmText.set(confirmText);
    dialogComponent.cancelText.set(cancelText);
    dialogComponent.showCancel.set(true);

    return dialogRef.afterClosed();
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}
