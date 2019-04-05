import { RenderResult } from "react-testing-library";

export function getFromInput(rendered: RenderResult) {
    return rendered.getByLabelText('from', {exact: false})        
}

export function getToInput(rendered: RenderResult){
    return rendered.getByLabelText('to', {exact: false})
}

export function getSubmitSearch(rendered: RenderResult){
    return rendered.getByDisplayValue('search', {exact: false})
}

export function getSearchForRoutes(rendered: RenderResult){
    return rendered.getByDisplayValue('routes', {exact: false})
}