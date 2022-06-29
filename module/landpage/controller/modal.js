window.LandpageHomeContactController = function($scope){
    $scope.model = {};
    $scope.btnClose_Click = function(){
        $scope.close();
    }
    $scope.close = function(){
        var idModal = $('#LandContactModalId').val();
		$('#' + idModal).modal('hide');
    }
}   