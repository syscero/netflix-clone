const mudarPerfil = (evt)  => {
   const selecao = evt.options[evt.selectedIndex].value   
   const query = selecao == 1 ? `?handicapped=true` : selecao == 2 ? '?hero=true' : '' 
   window.location.replace(window.location.pathname + query)
}