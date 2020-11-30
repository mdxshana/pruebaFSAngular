import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventBusService } from 'ngx-eventbus';
import { Task } from 'src/app/models/Task.model';
import { TaskService } from 'src/app/services/task.service';
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss'],
})
export class ModalTaskComponent implements OnInit {
  @Input() title: string;
  @Input() task: Task;
  @Input() action: number;

  taskForm: FormGroup;

  options = [
    'Baja',
    'Media',
    'Alta'
  ]



  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    protected _taskService:TaskService,
    private eventBus:EventBusService
  ) {
    this.taskForm = this.formBuilder.group({
      name: [this.task?.name, Validators.compose([Validators.required])],
      priority: [this.task?.priority, Validators.compose([Validators.required])],
      date_expire: [this.task?.date_expire, Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.task){
      this.taskForm.controls['name'].setValue(this.task.name);
      this.taskForm.controls['priority'].setValue(this.task.priority,{onlySelf: true});
      this.taskForm.controls['date_expire'].setValue(moment(this.task.date_expire).format('YYYY-MM-DD'),{onlySelf: true});
    }
  }



  onSubmit(){
    if(this.taskForm.valid){
      if(this.action == 1){
        this.task = new Task();
        Object.assign(this.task, this.taskForm.value);
        this._taskService.store(this.task).subscribe(resp => {
          swal.fire('¡Bien!','Tarea agregada satisfactoriamente','success');
          this.activeModal.close();
          Object.assign(this.task,resp);
          this.eventBus.triggerEvent('updateTasks',{task:this.task,action:this.action})
        })
      }else{
        this.task.name = this.taskForm.controls['name'].value;
        this.task.priority = this.taskForm.controls['priority'].value;
        this.task.date_expire = moment(this.taskForm.controls['date_expire'].value).format('YYYY-MM-DD');
        this._taskService.update(this.task).subscribe(resp => {
          swal.fire('¡Bien!','Tarea actualizada satisfactoriamente','success');
          this.activeModal.close();
          this.eventBus.triggerEvent('updateTasks',{task:this.task,action:this.action})
        })
      }
    }
  }
}
