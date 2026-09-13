using Xunit;

namespace BrValidator.Tests
{
    public class PixTests
    {
        [Fact]
        public void GetKeyType()
        {
            Assert.Equal(PixKeyType.Cpf, Pix.GetKeyType("52998224725"));
            Assert.Equal(PixKeyType.Cnpj, Pix.GetKeyType("11222333000181"));
            Assert.Equal(PixKeyType.Email, Pix.GetKeyType("user@example.com"));
            Assert.Equal(PixKeyType.Phone, Pix.GetKeyType("+5511987654321"));
            Assert.Equal(PixKeyType.Evp, Pix.GetKeyType("123e4567-e89b-12d3-a456-426655440000"));
            Assert.Null(Pix.GetKeyType("not-a-pix-key"));
        }

        [Theory]
        [InlineData("52998224725")]
        [InlineData("11222333000181")]
        [InlineData("user@example.com")]
        [InlineData("User@Example.COM")]
        [InlineData("+5511987654321")]
        [InlineData("+55 (11) 98765-4321")]
        [InlineData("123e4567-e89b-12d3-a456-426655440000")]
        [InlineData("123E4567-E89B-12D3-A456-426655440000")]
        public void IsValid_AcceptsValid(string value)
        {
            Assert.True(Pix.IsValid(value));
        }

        [Theory]
        [InlineData("529.982.247-25")]
        [InlineData("52998224700")]
        [InlineData("12ABC34501DE35")]
        [InlineData("11987654321")]
        [InlineData("+5500987654321")]
        [InlineData("+551187654321")]
        [InlineData("123456789")]
        [InlineData("123e4567-e89b-12d3-426655440000")]
        [InlineData("not a pix key!!")]
        [InlineData("")]
        public void IsValid_RejectsInvalid(string value)
        {
            Assert.False(Pix.IsValid(value));
        }

        [Theory]
        [InlineData("52998224725", "52998224725")]
        [InlineData("User@Example.COM", "user@example.com")]
        [InlineData("+55 (11) 98765-4321", "+5511987654321")]
        [InlineData("123E4567-E89B-12D3-A456-426655440000", "123e4567-e89b-12d3-a456-426655440000")]
        [InlineData("not-a-pix-key", "not-a-pix-key")]
        public void Normalize(string input, string expected)
        {
            Assert.Equal(expected, Pix.Normalize(input));
        }

        [Theory]
        [InlineData("52998224725", "529.982.247-25")]
        [InlineData("11222333000181", "11.222.333/0001-81")]
        [InlineData("User@Example.COM", "user@example.com")]
        [InlineData("+5511987654321", "+55 (11) 98765-4321")]
        [InlineData("123E4567-E89B-12D3-A456-426655440000", "123e4567-e89b-12d3-a456-426655440000")]
        [InlineData("not-a-pix-key", "not-a-pix-key")]
        public void Format(string input, string expected)
        {
            Assert.Equal(expected, Pix.Format(input));
        }
    }
}
