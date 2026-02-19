import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface SelectableItem {
  id: number;
  nombre: string;
  descripcion: string;
  selected: boolean;
}

@Component({
  selector: 'app-selection-dialog',
  imports: [MatDialogModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './selection-dialog.html',
  styleUrl: './selection-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionDialog {
  private readonly dialogRef = inject(MatDialogRef<SelectionDialog>);

  title = signal<string>('Seleccionar');
  items = signal<SelectableItem[]>([]);

  hasSelection = computed(() => this.items().some((item) => item.selected));

  toggleItem(index: number): void {
    this.items.update((items) =>
      items.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item,
      ),
    );
  }

  onConfirm(): void {
    const selectedItems = this.items().filter((item) => item.selected);
    this.dialogRef.close(selectedItems);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
