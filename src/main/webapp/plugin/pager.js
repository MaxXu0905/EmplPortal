/**
 * 分页
 */
(function(exports){
	/*构造函数*/
	function Pager(pageSize) {
		this.pageSize = pageSize;
		this.requestPage = 1; // start from 1
		// 是否有更多数据，当返回结果集小于pageSize时设置为false
		this.hasMore = true;
	}
	
	/*扩展*/
	Pager.prototype={
		// 下一页
		next :function(){
			this.requestPage++;
		},
		//重置
		reset : function(){
			this.requestPage = 1;
			this.hasMore = true;
		}
	}
	exports.createPager = function(pageSize){
		if(!pageSize){
			return;
		}
		return new Pager(pageSize);
	}
})(window);

						