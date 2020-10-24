const initialState = {
    purchaseOrderList: [],
    purchaseOrderListByName:[],
    purchaseOrderDetails: []
}

const PurchaseOrderState = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_PURCHASE_ORDER_LIST":
            return { ...state, purchaseOrderList: action.purchaseOrderList }
        case "SAVE_PURCHASE_ORDER_LIST_BY_NAME":
            return { ...state, purchaseOrderListByName: action.purchaseOrderList }
        case "SAVE_PURCHASE_ORDER_DATA":
            return { ...state, purchaseOrderDetails: action.purchaseOrderData }
        default:
            return state;
    }
}

export default PurchaseOrderState;