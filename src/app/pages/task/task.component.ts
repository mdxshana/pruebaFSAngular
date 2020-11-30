import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventBusService } from 'ngx-eventbus';
import { ModalTaskComponent } from 'src/app/components/modal-task/modal-task.component';
import { Task } from 'src/app/models/Task.model';
import { TaskService } from 'src/app/services/task.service';
import * as moment from 'moment';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];

  eventTask: any;


  taskStatus = {
    expires:0,
    forExpire:0
  }

  constructor(
    private modalService: NgbModal,
    protected _taskService: TaskService,
    protected eventBus: EventBusService
  ) {}


  ngOnDestroy(): void {
    this.eventBus.removeEventListener(this.eventTask);
  }

  ngOnInit(): void {

    this._taskService.task().subscribe((resp) => {
      this.tasks = resp.tasks;
      this.calcularVencidas();
    });

    this.eventTask = this.eventBus.addEventListener({
      name: 'updateTasks',
      callback: (payload: any) => {
        let task:Task = payload.task;
        if(payload.action == 1){
          this.tasks = [...this.tasks,task];
        }else{
          this.tasks = this.tasks.map(taskA => {
            console.log(taskA._id, task._id);
            if(taskA._id === task._id){
              taskA = task;
            }
            return taskA;
          })
        }
        this.calcularVencidas();
      },
    });
  }


  calcularVencidas(){
    this.taskStatus.expires = 0;
    this.taskStatus.forExpire = 0;
    let dateNow = new Date();
    let dateNowMoement = moment(dateNow).format('YYYY-MM-DD');
    dateNowMoement = moment(dateNowMoement).format('x');
    this.tasks.map(task => {
      if(moment(task.date_expire).format('x')<dateNowMoement && !task.status){
        this.taskStatus.expires +=1
      }else if(moment(task.date_expire).format('x') == dateNowMoement && !task.status){
        this.taskStatus.forExpire +=1
      }
    })
  }

  openModalTask(task?: Task) {
    const modalRef = this.modalService.open(ModalTaskComponent);
    if (task == undefined) {
      modalRef.componentInstance.title = 'Nueva tarea';
      modalRef.componentInstance.action = 1;
    } else {
      modalRef.componentInstance.title = 'Editar tarea';
      modalRef.componentInstance.action = 2;
    }
    modalRef.componentInstance.task = task;
    //modalRef.componentInstance.name = 'World';
  }

  updateStatus(task:Task){
    this._taskService.update(task).subscribe((resp:any) => {
      this.tasks.map(task => {
        if(task._id == resp._id){
          task = resp;
        }
      })
      this.calcularVencidas();
    })
  }

  destroy(task:Task){
    this._taskService.destroy(task).subscribe((resp:any) => {
     this.tasks = this.tasks.filter(task => {
        return task._id != resp._id;
      })
      this.calcularVencidas();
    })
  }
}
