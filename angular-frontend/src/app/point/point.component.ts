import { Component, OnInit,ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Task } from '../task.model';
import { Point } from '../point.model';
import { Person } from '../person.model';
import { Observable, zip } from 'rxjs';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.less']
})
export class PointComponent implements AfterViewInit{
	points: Point[] = [];
	children: Person[] = [];
	
	
	@ViewChild('canvas', {static: false})
	canvas: ElementRef<HTMLCanvasElement>; 
	ctx: CanvasRenderingContext2D | null;

	ngAfterViewInit(): void {
		this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
		var t1 = this.apiService.getPoints();
		var t2 = this.apiService.getChildren();
		const ts =zip(t1, t2);
		
		ts.subscribe((results)=>{
			this.points = results[0];
			this.children = results[1];
			let childrenR: Record<number,number> = {};
			let childrenRP: Record<number,Person> = {};
			
			var first=0;
			var second=0;
			var third=0;
			
			for(var i=0; i<this.children.length;i++){
				if (i==0) {first = this.children[i].PersonID; }
				if (i==1) {second = this.children[i].PersonID; }
				if (i==2) {third = this.children[i].PersonID; }
				
				childrenR[this.children[i].PersonID] = 0;
				childrenRP[this.children[i].PersonID] = this.children[i];
			}

			for(var i=0; i<this.points.length;i++){
				var p = this.points[i];
				if (childrenR[p.PersonID] ==null){childrenR[p.PersonID] = 0;}
				console.log(childrenR[p.PersonID], childrenR[p.PersonID], p.Points);
				childrenR[p.PersonID] = childrenR[p.PersonID] + p.Points;
				let c = childrenR[p.PersonID];
				if (c> childrenR[first]){
					second = first;
					first = p.PersonID;
				}else if (c> childrenR[second] && c < childrenR[first]){
					third = second;
					second = p.PersonID;
				}else if(c > childrenR[third]&& c < childrenR[second]){
					third = p.PersonID;
				}
				
			}
			
			this.update(childrenRP[first], childrenRP[second],childrenRP[third]);
			
		});
		
	}
	beautify(child: Person):string {
		if (child == null) { return "" ;}
		return child.FirstName + " " + child.LastName;
	}
	update(first: Person,second: Person,third: Person):void{
		if(this.ctx==null){
			return;
		}
		
		this.ctx.clearRect(0, 0, 500, 300);
		this.ctx.beginPath();
		this.ctx.font = "14px Arial";
		this.ctx.textAlign = "center";
		this.ctx.rect(25, 125, 150, 150);
		this.ctx.rect(175, 75, 150, 200);
		this.ctx.rect(325, 175, 150, 100);
		this.ctx.fillText(this.beautify(second), 100, 100);
		this.ctx.fillText(this.beautify(first), 250, 50);
		this.ctx.fillText(this.beautify(third), 400, 150);
		this.ctx.font = "40px Arial";
		this.ctx.fillStyle = "blue";
		this.ctx.fillText("2", 100, 210);
		this.ctx.fillText("1", 250, 190);
		this.ctx.fillText("3", 400, 240);
		this.ctx.stroke();
	}
    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
    }

}
