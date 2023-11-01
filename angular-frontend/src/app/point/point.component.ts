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
			
			let first: number[] =[];
			let second: number[] =[];
			let third: number[] =[];
			
			for(let i=0; i<this.children.length;i++){
				childrenR[this.children[i].PersonID] = 0;
				childrenRP[this.children[i].PersonID] = this.children[i];
			}

			for(let i=0; i<this.points.length;i++){
				let p = this.points[i];
				if (childrenR[p.PersonID] ==null){childrenR[p.PersonID] = 0;}
				childrenR[p.PersonID] = childrenR[p.PersonID] + p.Points;
			}
			
			const sortedChildrenR = Object.entries(childrenR)
			.filter((a) => a[1]>0)
			.map((a,b,c)=> [Number(a[0]),a[1]])			
			.sort((a,b) => a[1] > b[1] ? -1 : (a[1]<b[1] ?  1 : 0) );
			
			let firstNames = "";
			let secondNames = "";
			let thirdNames = "";
			let k = 0;
			for(let i=0;i<sortedChildrenR.length;i++){
				k=i;
				firstNames += this.beautify(childrenRP[sortedChildrenR[i][0]]) + " ";
				if (i<sortedChildrenR.length-1 && sortedChildrenR[i] != sortedChildrenR[i+1]){
					break;
				}
			}
			for(var i=k+1;i<sortedChildrenR.length;i++){
				k=i;
				secondNames += this.beautify(childrenRP[sortedChildrenR[i][0]]) + " ";
				if (i<sortedChildrenR.length-1 && sortedChildrenR[i] != sortedChildrenR[i+1]){
					break;
				}
			}
			for(var i=k+1;i<sortedChildrenR.length;i++){
				k=i;
				thirdNames += this.beautify(childrenRP[sortedChildrenR[i][0]]) + " ";
				if (i<sortedChildrenR.length-1 && sortedChildrenR[i] != sortedChildrenR[i+1]){
					break;
				}
			}
			
			this.update(firstNames.trim(), secondNames.trim(),thirdNames.trim());
			
		});
		
	}
	beautify(child: Person):string {
		if (child == null) { return "" ;}
		return child.FirstName + " " + child.LastName;
	}
	update(first: string,second: string,third: string):void{
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
		this.ctx.fillText(second, 100, 100);
		this.ctx.fillText(first, 250, 50);
		this.ctx.fillText(third, 400, 150);
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
