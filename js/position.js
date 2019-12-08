class Position
{
	constructor(x, y)
	{
		this.x = x
		this.y = y
	}

	equals(position)
	{
		return this.x == position.x && this.y == position.y
	}
}