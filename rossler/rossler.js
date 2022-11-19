function nextRossler(p,a,b,c,dt) {
	var x = p[0];
	var y = p[1];
	var z = p[2];

	var nx = x - dt * (y + z);
	var ny = y + dt * (x + a*y);
	var nz = z + dt * (b + z * (x - c));

	return [nx,ny,nz];	 
}

function rosslerGenerator(a,b,c,dt) {
	var r = function(p) {
		return nextRossler(p,a,b,c,dt);
	};
	return r;
}

function trajectory(g,n,p0) {
	var ps = [p0];
	for(i = 0; i < n; ++i) {
		ps.push(g(ps[i]));
	}
	return ps;
}