//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { render } from '@testing-library/react';

const char = [{
	"id": 1,
	"short": "Ar",
	"job": "Archer",
	"hp": 20,
	"atk": 3,
	"def": 3,
	"move": 3,
	"range": 5
},{
	"id": 2,
	"short": "Br",
	"job": "Bruiser",
	"hp": 30,
	"atk": 2,
	"def": 6,
	"move": 2,
	"range": 1
},{
	"id": 3,
	"short": "Me",
	"job": "Medic",
	"hp": 20,
	"atk": 3,
	"def": 2,
	"move": 4,
	"range": 1
},{
	"id": 4,
	"short": "Lu",
	"job": "Lumberjack",
	"hp": 20,
	"atk": 3,
	"def": 3,
	"move": 3,
	"range": 5
},{
	"id": 5,
	"short": "Sp",
	"job": "Spearman",
	"hp": 30,
	"atk": 5,
	"def": 2,
	"move": 2,
	"range": 1
}, {
	"id": 6,
	"short": "Sl",
	"job": "Sling",
	"hp": 20,
	"atk": 3,
	"def": 3,
	"move": 4,
	"range": 4
}, {
	"id": 7,
	"short": "Be",
	"job": "Beastmaster",
	"hp": 25,
	"atk": 3,
	"def": 3,
	"move": 3,
	"range": 2
}]

const enemy = 
{"id": 1,
"short": "E",
"job": "Archer",
"hp": 20,
"atk": 3,
"def": 3,
"move": 3,
"range": 5
}


class Cell extends React.Component {
	
	render() {
		var name = ""
		var hasUnit = false
		if (this.props.value.unit != null){
			name = this.props.value.unit.short
			hasUnit = true
		}

		let className = 'cell' 
		+ (this.props.value.isSelected? " is-selected" : "") 
		+ (hasUnit? " has-unit" : "")

		return(
			<div 
			className={className}
			onClick={this.props.onClick}
			onContextMenu = {this.props.cMenu}
			>{name}</div>
		)
	}
}

function Unit(props){
	try {
		return(
			<button 
			onClick={props.onClick}
			className="unit-button"
			>
				{props.value.short}
			</button>
		)
	} catch (error) {
		return null
	}
}

class Board extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			boardData: this.createEmptyArray(this.props.height, this.props.width),
			boardHistory: [],
			unitSelect: null,
			cellSelect: null,
			unitArray: [0,0,0,0,0,0,0],
			phase: 0 //0:prep 1:combat 2:post
		}
	}

	createEmptyArray(height, width) {
		let data = [];
		for (let i = 0; i < height; i++) {
			data.push([]);
			for (let j = 0; j < width; j++) {
				data[i][j] = {
					x: i,
					y: j,
					cellNumber: i*100+j,
					unit: null,
					isSelected: false
				};
			}
		}
		return data;
	}

	selectUnit(unit){ //for unit buttons
		if(this.unitSelect == null){
			this.setState({unitSelect: unit})
		} else if (this.unitSelect === unit) {
			this.setState({unitSelect: null})
		}
	}


	_handleCellClick(x, y){
		let data = this.state.boardData;
		let hasUnit = data[x][y].unit != null;
		let unitSelected = this.state.unitSelect != null;
		let thisCell = (this.state.cellSelect === data[x][y].cellNumber)||(this.state.cellSelect === null);
		let unitArray = this.state.unitArray;
		
		switch(this.state.phase){
			case 0: //prep
				if (hasUnit && thisCell) { //toggle cell selection
					//let range = data[x][y].unit.range
					if(data[x][y].isSelected === false){ //tog on
						data[x][y].isSelected = true
						this.setState({
							boardData:data, 
							cellSelect: data[x][y].cellNumber,
							unitSelect: data[x][y].unit
						})
					} else {							 //tog off
						data[x][y].isSelected = false 
						this.setState({
							boardData:data, 
							cellSelect: null,
							unitSelect: null
						})
					}
				} else if(!thisCell && !hasUnit) { //move unit if selected and empty cell clicked
					let j = this.state.cellSelect % 100;
					let i = (this.state.cellSelect - j)/100;
					console.log(i,j)
					data[x][y].unit = this.state.unitSelect
					data[i][j].unit = null
					data[i][j].isSelected = false
					this.setState({
						boardData:data,
						unitSelect:null,
						cellSelect: null
					})
				} else if(!unitSelected){  // no unit selcted
					return
				}
				else if(unitArray[this.state.unitSelect.id - 1] === 0){ //add unit to cell
					data[x][y].unit = this.state.unitSelect
					unitArray[this.state.unitSelect.id - 1] +=1;
					this.setState({
						boardData:data, 
						unitSelect:null,
						unitArray:unitArray
					})
				}
				break;
			case 1: //combat
				if (hasUnit && thisCell) { //toggle cell selection
					//let range = data[x][y].unit.range
					if(data[x][y].isSelected === false){ //tog on
						data[x][y].isSelected = true
						this.setState({
							boardData:data, 
							cellSelect: data[x][y].cellNumber,
							unitSelect: data[x][y].unit
						})
					} else {							 //tog off
						data[x][y].isSelected = false 
						this.setState({
							boardData:data, 
							cellSelect: null,
							unitSelect: null
						})
					}
				} else if(!thisCell && !hasUnit) {
					let j = this.state.cellSelect % 100;
					let i = (this.state.cellSelect - j)/100;
					console.log(i,j)
					data[x][y].unit = this.state.unitSelect
					data[i][j].unit = null
					data[i][j].isSelected = false
					this.setState({
						boardData:data,
						unitSelect:null,
						cellSelect: null
					})
				}
				break;
			case 2:
				break;
			default:
				return;
		}
	}

	_handleContextMenu(e,x,y){
		e.preventDefault()
		let data = this.state.boardData;
		let unitArray = this.state.unitArray;
		let hasUnit = data[x][y].unit != null;

		switch (this.state.phase){
			case 0: //prep
				if (hasUnit){
					unitArray[data[x][y].unit.id - 1] -= 1;
					data[x][y].unit = null;
					this.setState({
						boardData:data,
						unitArray:unitArray
					});
				} break;
			case 1: //combat
				break;
			case 2:
				break;
			default:
				return;
		}
	}

	_next(){
		let phase = this.state.phase
		if (phase<2){phase+=1}
		this.setState({phase:phase})
	}

	_reset(){
		this.setState({
			boardData: this.createEmptyArray(this.props.height, this.props.width),
			boardHistory: [],
			unitSelect: null,
			cellSelect: null,
			unitArray: [0,0,0,0,0,0],
			phase: 0 //0:prep 1:combat 2:post
		})
	}

	renderPhase(){
		let phase
		switch(this.state.phase){
			case 0: phase = "Preparation"; break
			case 1: phase = "Combat"; break
			case 2: phase = "Post"; break
			default: return
		}
		return(<div>{phase} Phase</div>)
	}

	renderUnitButtons(){
		return(this.props.char.map((unit)=>{
			return(
			<span key={unit.job}>
				<Unit value={unit} onClick={() =>this.selectUnit(unit)}/>
			</span>
			)
		}))
	}

	renderBoard(data){
		return (data.map((datarow)=>{
			return (datarow.map(dataitem=>{
				return(
					<div key={dataitem.x * datarow.length + dataitem.y}>
				<Cell
				onClick={() => this._handleCellClick(dataitem.x, dataitem.y)}
				cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}
				value={dataitem}/>
				{(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
					</div>
				)
			}))
		}))
	}

	//{this.renderPhase()}
	//<Unit value={enemy} onClick={() =>this.selectUnit(enemy)}/>
	//<button onClick={()=>this._next()}>next</button>

	render(){
		return(
			<div>
				
				<div id="units">
					{this.renderUnitButtons(this.state.unitArray)}
				</div>
				<div id="board">
					{this.renderBoard(this.state.boardData)}
				</div>
				<div>
					
					<button>undo</button>
					<button onClick={()=>this._reset()}>reset</button>
				</div>
				<div>
					
				</div>
			</div>
		)
	}
}

// Game Class
class App extends React.Component {
	state = {
	height: 25,
	width: 30,
	char: char
	};

	render() {
		const { height, width } = this.state;
		return (
			<div>
				<div id='status'>
					<p>Status</p>
					<Status char={this.state.char}/>
				</div>
				<div id='deck'>
					<p>Travel</p>
					<img src='./assets/archer.PNG' alt='placeholder(cards)'/>
				</div>
				<div id='combat'>
					<p>Combat</p>
					<Board height={height} width={width} char={char} />
				</div>
			</div>
		);
	}
}

function Status(props){
	return(
		<table>
			<thead>
				<tr>
					{props.char.map((unit)=>{return(<th key={unit.id}>{unit.job}</th>)})}
				</tr>
			</thead>
			<tbody>
				<tr>
					{props.char.map((unit)=>{return(<td key={unit.id*10 + 1}>HP: {unit.hp}</td>)})}
				</tr>
				<tr>
					{props.char.map((unit)=>{return(<td key={unit.id*10 + 2} className='stat'>
						<ul  key={unit.id*10 + 3}>
							<li key={unit.id*10 + 4}>ATK: {unit.atk}</li>
							<li key={unit.id*10 + 5}>DEF: {unit.def}</li>
							<li key={unit.id*10 + 6}>MOV: {unit.move}</li>
							<li key={unit.id*10 + 7}>RNG: {unit.range}</li>
						</ul>
					</td>)})}
				</tr>
			</tbody>
		</table>
	)
}





export default App;

