CREATE TABLE [dbo].[PropertyImage]
(
	[Id] NVARCHAR(50) NOT NULL PRIMARY KEY,
	[InmuebleId] NVARCHAR(50) NOT NULL,
	[ImageUrl] NVARCHAR(max) NOT NULL,
	[ContentType] NVARCHAR(100) NOT NULL,
	[SizeInBytes] INT NOT NULL,
	[Order] INT NOT NULL,
	[IsPrimary] bit NOT NULL ,
	[CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
	FOREIGN KEY (InmuebleId) REFERENCES Inmueble(Id)
)
