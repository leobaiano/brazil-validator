using Xunit;

namespace BrValidator.Tests
{
    public class CepTests
    {
        [Theory]
        [InlineData("01310-100")]
        [InlineData("01310100")]
        [InlineData("11111-111")]
        [InlineData("70002-900")]
        [InlineData("20040-020")]
        public void IsValid_AcceptsValid(string value)
        {
            Assert.True(Cep.IsValid(value));
        }

        [Theory]
        [InlineData("0131010")]
        [InlineData("013101000")]
        [InlineData("01310-10A")]
        [InlineData("013abc10-100")]
        [InlineData("")]
        [InlineData("        ")]
        [InlineData("1234")]
        [InlineData("abcde-fgh")]
        public void IsValid_RejectsInvalid(string value)
        {
            Assert.False(Cep.IsValid(value));
        }

        [Fact]
        public void Normalize()
        {
            Assert.Equal("01310100", Cep.Normalize("01310-100"));
        }

        [Theory]
        [InlineData("01310100", "01310-100")]
        [InlineData("01310-100", "01310-100")]
        [InlineData("123", "123")]
        public void Format(string input, string expected)
        {
            Assert.Equal(expected, Cep.Format(input));
        }
    }
}
