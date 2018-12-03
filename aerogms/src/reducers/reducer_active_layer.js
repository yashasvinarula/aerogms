import * as type from '../actions/types';

const initialState = {
    activeLayer : '',
    activeLayer_id :'',
    activeLayer_type :'',
    activeLayer_box:'',
};

export default function(state = initialState, action){
    console.log(action.payload);
    switch(action.type){
        case type.MAKE_ACTIVE_LAYER:
            const { activeLayer, activeLayer_id, activeLayer_type, activeLayer_box} = action.payload.activelayerdata;
            return {...state, 
                activeLayer : activeLayer,
                activeLayer_id : activeLayer_id,
                activeLayer_type :activeLayer_type,
                activeLayer_box:activeLayer_box};
        case type.UPDATE_ACTIVE_LAYER:
        debugger
        const {new_activeLayer_id} = action.payload;
                return {...state, activeLayer_id:new_activeLayer_id};
        default:
            return state;
    }
}