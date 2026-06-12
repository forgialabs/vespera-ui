import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'vsp-file-dropzone',
  template: `<div
    [class]="'ui-dropzone' + (drag ? ' drag' : '')"
    role="button"
    tabindex="0"
    (click)="input.click()"
    (keydown.enter)="input.click()"
    (keydown.space)="input.click()"
    (dragover)="onDragOver($event)"
    (dragleave)="drag = false"
    (drop)="onDrop($event)"
  >
    <span class="dz-icon">
      <svg
        viewBox="0 0 24 24"
        width="21"
        height="21"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
    </span>
    <div style="font-weight: 600; font-size: 13.5px">
      Drop files or <span style="color: var(--accent)">browse</span>
    </div>
    <div style="font-size: 12px; color: var(--text-faint)">{{ hint }}</div>
    <input
      #input
      type="file"
      [attr.accept]="accept"
      [multiple]="multiple"
      hidden
      (change)="onChange($event)"
    />
  </div>`,
})
export class VspFileDropzone {
  @Input() hint = 'PNG, JPG or PDF up to 10MB';
  @Input() accept?: string;
  @Input() multiple = true;
  @Output() files = new EventEmitter<File[]>();
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  drag = false;

  private take(list: FileList | null): void {
    if (list && list.length) this.files.emit(Array.from(list));
  }
  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.drag = true;
  }
  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.drag = false;
    this.take(e.dataTransfer?.files ?? null);
  }
  onChange(e: Event): void {
    this.take((e.target as HTMLInputElement).files);
  }
}
