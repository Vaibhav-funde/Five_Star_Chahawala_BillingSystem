import { Component } from "react";
import JSON from './Json/Menus.json'
import Menu from "./Menu";
import Chaidetail from "./Chaidetail";
class MenuList extends Component{
    constructor(){
        super();
        this.state={
            menudata:JSON
        }
    }
    render(){

        return(
            <div>
                <Menu menulist ={this.state.menudata}/> 
                <Chaidetail menulist= {this.state.menudata}/>

            </div>
        )
    }
}
export default MenuList;