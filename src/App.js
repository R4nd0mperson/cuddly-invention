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
			unitSelect: null,
			cellSelect: null
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
								cellNumber: j*100+i,
								unit: null,
								isSelected: false
						};
				}
		}
		return data;
	}

	selectUnit(unit){
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
		
		if (hasUnit && thisCell) { //toggle cell selection
			this.setState({unitSelect: null})
			if(data[x][y].isSelected === false){
				data[x][y].isSelected = true
				this.setState({boardData:data, cellSelect: data[x][y].cellNumber})
			} else {
				data[x][y].isSelected = false
				this.setState({boardData:data, cellSelect: null})
			}
		} else if(!unitSelected){  // no unit selcted
			return
		}
		else { //add unit to cell
			data[x][y].unit = this.state.unitSelect
			this.setState({boardData:data, unitSelect:null})
		}
	}

	renderBoard(data){
		return (data.map((datarow)=>{
			return (datarow.map(dataitem=>{
				return(
					<div key={dataitem.x * datarow.length + dataitem.y}>
				<Cell
				onClick={() => this._handleCellClick(dataitem.x, dataitem.y)}
				//cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}
				value={dataitem}/>
				{(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
					</div>
				)
			}))
		}))
	}

	render(){
		return(
			<div>
				<div id="units">
					{this.props.char.map((unit)=>{return(
						<Unit key={unit.job} value={unit} onClick={() =>this.selectUnit(unit)}/>
					)})}
				</div>
				<div id="board">
					{this.renderBoard(this.state.boardData)}
				</div>
				<div>
					<button>undo</button>
					<button>reset</button>
				</div>
				<div>
					<Unit value={enemy} onClick={() =>this.selectUnit(enemy)}/>
				</div>
			</div>
		)
	}
}

// Game Class
class App extends React.Component {
	state = {
	height: 3,
	width: 3,
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
					{props.char.map((unit)=>{return(<td className='stat'>
						<ul  key={unit.id*10 + 6}>
							<li key={unit.id*10 + 2}>ATK: {unit.atk}</li>
							<li key={unit.id*10 + 3}>DEF: {unit.def}</li>
							<li key={unit.id*10 + 4}>MOV: {unit.move}</li>
							<li key={unit.id*10 + 5}>RNG: {unit.range}</li>
						</ul>
					</td>)})}
				</tr>
			</tbody>
		</table>
	)
}





export default App;

