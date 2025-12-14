CREATE TABLE [dbo].[Inmueble]
(
	[Id] NVARCHAR(50) NOT NULL PRIMARY KEY,
	[PropertyType] NVARCHAR(150) NOT NULL,
	[OperationType] NVARCHAR(150),
	[Description] NVARCHAR(max),
	[Rooms] INT NOT NULL,
	[Size] DECIMAL(20, 2) NOT NULL,
	[Antiquity] DECIMAL(10, 2),
	[Location] NVARCHAR(250),
	[IsActive] bit NOT NULL ,
	[CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
)
